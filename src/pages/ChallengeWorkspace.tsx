import { useParams, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Flag, 
  Globe, 
  Send,
  Terminal,
  FileText,
  Lightbulb,
  CheckCircle,
  XCircle,
  RefreshCcw,
  CloudDownload,
} from 'lucide-react';
import { debounce } from 'lodash';

// API URL
const API_URL = "http://192.168.0.107:5000";

const ChallengeWorkspace = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [flagInput, setFlagInput] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalOutput, setTerminalOutput] = useState([]);
  const [terminalTextColor, setTerminalTextColor] = useState('text-green-400');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentDir, setCurrentDir] = useState('/home');
  const [currentUser, setCurrentUser] = useState('user'); // Default olaraq 'user'
  const terminalRef = useRef(null);
  const inputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('notes');

  // İpucular üçün yeni state
  const [revealedHints, setRevealedHints] = useState(0);

  // Simulated file system
  const [fileSystem, setFileSystem] = useState({
    '/home': {
      user: {
        type: 'directory',
        content: {
          'flag.txt': { type: 'file', content: 'Permission denied.', protected: true },
          'notes.md': { type: 'file', content: 'This is your personal notes file.' },
          'docs': { type: 'directory', content: {} },
        }
      }
    },
    '/': {
      'bin': { type: 'directory', content: {} },
      'etc': { type: 'directory', content: {} },
      'home': { type: 'directory', content: {} },
      'tmp': { type: 'directory', content: {} }
    }
  });

  // Load challenge data and user state (notes, solved status, revealed hints)
  useEffect(() => {
    const fetchChallengeData = async () => {
      try {
        setLoading(true);
        const mockChallenges = {
          1: {
            id: 1,
            title: 'SQL Injection Əsasları',
            category: 'Web',
            difficulty: 'Asan',
            points: 50,
            targetUrl: API_URL,
            hints: [
              'Verilənlər bazası ilə qarşılıqlı əlaqədə olan giriş sahələrini axtarmağa çalışın',
              'Xəta mesajları faydalı məlumatları ortaya çıxara bilər',
              '`category` parametrini `http://targeturl/products?category=` sorğusu ilə yoxlayın',
              'Blind SQL Injection hücumu üçün Python-da `substring` və `length` funksiyalarından istifadə etməlisiniz.',
              'Diqqətli olun! `eval()` funksiyası çox təhlükəlidir və birbaşa Python kodunu işlədə bilər.'
            ],
          },
        };
        const fetchedChallenge = mockChallenges[id];
        if (!fetchedChallenge) {
          navigate('/challenges');
          return;
        }
        setChallenge(fetchedChallenge);
        setLoading(false);
      } catch (error) {
        toast({
          title: "Xəta",
          description: "Tapşırıq məlumatları yüklənə bilmədi.",
          variant: "destructive"
        });
        setLoading(false);
      }
    };

    const loadUserState = () => {
      const savedNotes = localStorage.getItem(`ctf-notes-${id}`);
      if (savedNotes) setNotes(savedNotes);

      const solvedStatus = localStorage.getItem(`ctf-solved-${id}`);
      if (solvedStatus) setIsSolved(JSON.parse(solvedStatus));
      
      const savedHints = localStorage.getItem(`ctf-revealed-hints-${id}`);
      if (savedHints) setRevealedHints(parseInt(savedHints, 10));


    };

    fetchChallengeData();
    loadUserState();
    addTerminalLine('Xoş gəlmisiniz! Yardım üçün \'help\' və ya \'tree\' yazın.', 'welcome');
    addTerminalLine('[INFO] Mühit hazırlandı.', 'info');
  }, [id, navigate, toast]);

  // Save notes to localStorage with debounce
  const saveNotes = useCallback(
    debounce((newNotes) => {
      localStorage.setItem(`ctf-notes-${id}`, newNotes);
      toast({ description: "Qeydlər avtomatik yadda saxlanıldı.", duration: 1500 });
    }, 1000),
    [id, toast]
  );

  useEffect(() => {
    saveNotes(notes);
  }, [notes, saveNotes]);

  // Scroll to bottom of terminal output
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalOutput]);

  // Focus on input field when console tab is active
  useEffect(() => {
    if (activeTab === 'console' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [activeTab]);

  const addTerminalLine = (line, type = 'info') => {
    setTerminalOutput(prevOutput => [...prevOutput, { line, type }]);
  };

  const getNodeByPath = (path) => {
    const parts = path.split('/').filter(p => p);
    let current = fileSystem;
    for (const part of parts) {
      if (!current || !current[part]) {
        return null; // Path part not found
      }
      if (current[part].type === 'directory') {
        current = current[part].content;
      } else {
        return { node: current[part], parent: current, name: part };
      }
    }
    return { node: current, parent: null, name: '' };
  };

  const handlePing = async (host) => {
    addTerminalLine(`ping ${host}...`, 'command');
    try {
      const response = await fetch(`${API_URL}/ping?host=${host}`);
      if (response.ok) {
        addTerminalLine(`ping: Gecikmə: 64ms URL: ${host}`, 'success');
      } else {
        addTerminalLine(`ping: ${host}-ə çatıla bilmədi. Status: ${response.status}`, 'error');
      }
    } catch (error) {
      addTerminalLine(`ping: ${host}-ə çatıla bilmədi. Xəta: ${error.message}`, 'error');
    }
  };

  const handleFlagSubmit = async () => {
    if (!flagInput.trim()) {
      toast({
        title: "Səhv",
        description: "Zəhmət olmasa flaqı daxil edin.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/solve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ flag: flagInput }),
      });
      const data = await response.json();

      if (data.status === 'success') {
        toast({
          title: "Düzgün Flaq! 🎉",
          description: `Təbriklər! Siz ${challenge.points} xal qazandınız.`,
        });
        setIsSolved(true);
        localStorage.setItem(`ctf-solved-${id}`, JSON.stringify(true));
      } else {
        toast({
          title: "Səhv Flaq",
          description: data.message || "Yenidən cəhd edin! Həll metodunu və ipuclarını yoxlayın.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Xəta",
        description: "Flaqı göndərərkən xəta baş verdi. Back-end-in işlədiyinə əmin olun.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTerminalSubmit = async (e) => {
    if (e.key === 'Enter' && terminalInput.trim() !== '') {
      const command = terminalInput.trim();
      setCommandHistory(prev => [command, ...prev]);
      setHistoryIndex(-1);
      setTerminalInput('');
      addTerminalLine(`${currentUser}@ctf-box:${currentDir}$ ${command}`, 'command');

      const parts = command.split(' ').filter(p => p);
      const cmd = parts[0].toLowerCase();
      const args = parts.slice(1);

      switch (cmd) {
        case 'help':
          addTerminalLine('Mövcud əmrlər: help, clear, ping, get, color, tree, ls, cat, echo, whoami, pwd, cd, mkdir, touch, rm', 'info');
          break;
        case 'clear':
          setTerminalOutput([]);
          break;
        case 'ping':
          if (args.length > 0) {
            await handlePing(args[0]);
          } else {
            addTerminalLine('İstifadə: ping <url>', 'error');
          }
          break;
        case 'get':
          if (args.length > 0) {
            addTerminalLine(`URL yüklənir: ${args[0]}`, 'command');
            try {
              const response = await fetch(`${API_URL}/get_data?url=${args[0]}`);
              const data = await response.json();
              addTerminalLine(`Cavab ${args[0]}-dən:`, 'info');
              addTerminalLine(JSON.stringify(data, null, 2), 'info');
            } catch (error) {
              addTerminalLine(`URL-u yükləyərkən xəta: ${error.message}`, 'error');
            }
          } else {
            addTerminalLine('İstifadə: get <url>', 'error');
          }
          break;
        case 'color':
          if (args[0] === 'a') {
            setTerminalTextColor('text-green-400');
            addTerminalLine("Rəng yaşıl rəngə dəyişdirildi.", 'success');
          } else if (args[0] === 'b') {
            setTerminalTextColor('text-blue-400');
            addTerminalLine("Rəng mavi rəngə dəyişdirildi.", 'success');
          } else if (args[0] === 'c') {
            setTerminalTextColor('text-red-400');
            addTerminalLine("Rəng qırmızı rəngə dəyişdirildi.", 'success');
          } else {
            addTerminalLine('İstifadə: color [a|b|c]', 'info');
            addTerminalLine('   a - Yaşıl', 'info');
            addTerminalLine('   b - Mavi', 'info');
            addTerminalLine('   c - Qırmızı', 'info');
          }
          break;
        case 'tree':
          const displayTree = (fs, prefix = '') => {
            Object.keys(fs).forEach((key, index, array) => {
              const isLast = index === array.length - 1;
              const node = fs[key];
              addTerminalLine(`${prefix}${isLast ? '└──' : '├──'} ${key}${node.type === 'directory' ? '/' : ''}`, 'info');
              if (node.type === 'directory') {
                displayTree(node.content, `${prefix}${isLast ? '    ' : '│   '}`);
              }
            });
          };
          addTerminalLine('Directory structure:', 'info');
          displayTree(fileSystem);
          break;
        case 'ls':
        case 'dir':
          const lsNode = getNodeByPath(currentDir);
          if (lsNode && lsNode.node.type === 'directory') {
            const files = Object.keys(lsNode.node.content).join('  ');
            addTerminalLine(files || '(empty)', 'info');
          } else {
            addTerminalLine(`ls: ${currentDir}: No such directory`, 'error');
          }
          break;
        case 'cat':
          if (args.length > 0) {
            const fileNode = getNodeByPath(`${currentDir}/${args[0]}`);
            if (fileNode && fileNode.node.type === 'file') {
              if (fileNode.node.protected) {
                addTerminalLine('İcazə rədd edildi.', 'error');
              } else {
                addTerminalLine(fileNode.node.content, 'info');
              }
            } else {
              addTerminalLine(`cat: ${args[0]}: No such file`, 'error');
            }
          } else {
            addTerminalLine('İstifadə: cat <file>', 'error');
          }
          break;
        case 'echo':
          addTerminalLine(args.join(' '), 'info');
          break;
        case 'whoami':
          addTerminalLine(currentUser, 'info');
          break;
        case 'pwd':
          addTerminalLine(currentDir, 'info');
          break;
        case 'cd':
          if (args.length === 0 || args[0] === '~') {
            setCurrentDir(`/home/${currentUser}`);
            addTerminalLine(`Changed directory to /home/${currentUser}`, 'info');
          } else {
            let targetPath = args[0];
            if (targetPath === '..') {
              const parentDir = currentDir.split('/').slice(0, -1).join('/') || '/';
              setCurrentDir(parentDir);
              addTerminalLine(`Changed directory to ${parentDir}`, 'info');
              return;
            }
            if (!targetPath.startsWith('/')) {
              targetPath = `${currentDir === '/' ? '' : currentDir}/${targetPath}`;
            }
            const node = getNodeByPath(targetPath);
            if (node && node.node.type === 'directory') {
              setCurrentDir(targetPath);
              addTerminalLine(`Changed directory to ${targetPath}`, 'info');
            } else {
              addTerminalLine(`cd: ${args[0]}: No such directory`, 'error');
            }
          }
          break;
        case 'mkdir':
          if (args.length > 0) {
            const dirName = args[0];
            const dirNode = getNodeByPath(currentDir);
            if (dirNode && dirNode.node.type === 'directory' && !dirNode.node.content[dirName]) {
              setFileSystem(prev => {
                const newFs = JSON.parse(JSON.stringify(prev));
                let current = newFs;
                const parts = currentDir.split('/').filter(p => p);
                for (const part of parts) {
                  current = current[part].content;
                }
                current[dirName] = { type: 'directory', content: {} };
                return newFs;
              });
              addTerminalLine(`Created directory ${dirName}`, 'success');
            } else if (dirNode && dirNode.node.content[dirName]) {
              addTerminalLine(`mkdir: ${dirName}: Directory already exists`, 'error');
            } else {
              addTerminalLine(`mkdir: ${currentDir}: No such directory`, 'error');
            }
          } else {
            addTerminalLine('İstifadə: mkdir <directory>', 'error');
          }
          break;
        case 'touch':
          if (args.length > 0) {
            const fileName = args[0];
            const dirNode = getNodeByPath(currentDir);
            if (dirNode && dirNode.node.type === 'directory' && !dirNode.node.content[fileName]) {
              setFileSystem(prev => {
                const newFs = JSON.parse(JSON.stringify(prev));
                let current = newFs;
                const parts = currentDir.split('/').filter(p => p);
                for (const part of parts) {
                  current = current[part].content;
                }
                current[fileName] = { type: 'file', content: '', protected: false };
                return newFs;
              });
              addTerminalLine(`Created file ${fileName}`, 'success');
            } else if (dirNode && dirNode.node.content[fileName]) {
              addTerminalLine(`touch: ${fileName}: File already exists`, 'error');
            } else {
              addTerminalLine(`touch: ${currentDir}: No such directory`, 'error');
            }
          } else {
            addTerminalLine('İstifadə: touch <file>', 'error');
          }
          break;
        case 'rm':
          if (args.length > 0) {
            const targetName = args[0];
            const targetNode = getNodeByPath(`${currentDir}/${targetName}`);
            if (targetNode && targetNode.parent) {
              if (targetNode.node.protected) {
                addTerminalLine(`rm: ${targetName}: Permission denied`, 'error');
              } else {
                setFileSystem(prev => {
                  const newFs = JSON.parse(JSON.stringify(prev));
                  let current = newFs;
                  const parts = currentDir.split('/').filter(p => p);
                  for (const part of parts) {
                    current = current[part].content;
                  }
                  delete current[targetName];
                  return newFs;
                });
                addTerminalLine(`Removed ${targetName}`, 'success');
              }
            } else {
              addTerminalLine(`rm: ${targetName}: No such file or directory`, 'error');
            }
          } else {
            addTerminalLine('İstifadə: rm <file or directory>', 'error');
          }
          break;
        default:
          addTerminalLine(`bash: ${cmd}: command not found`, 'error');
          break;
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        setHistoryIndex(prev => prev + 1);
        setTerminalInput(commandHistory[historyIndex + 1] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        setHistoryIndex(prev => prev - 1);
        setTerminalInput(commandHistory[historyIndex - 1] || '');
      } else {
        setHistoryIndex(-1);
        setTerminalInput('');
      }
    }
  };

  const handleGetHint = () => {
    if (revealedHints < challenge.hints.length) {
      const newRevealedHints = revealedHints + 1;
      setRevealedHints(newRevealedHints);
      localStorage.setItem(`ctf-revealed-hints-${id}`, String(newRevealedHints));
      toast({
        title: "Yeni İpucu Açıqdır!",
        description: "İpucular bölməsinə nəzər yetirin.",
      });
    } else {
      toast({
        title: "Bütün İpucları Açıldı",
        description: "Artıq yeni ipucu mövcud deyil.",
        variant: "destructive",
      });
    }
  };
  
  const handleDownloadFile = () => {
    const fileUrl = '/challange1.pdf';
    
    const link = document.createElement('a');
    link.href = fileUrl;
    link.setAttribute('download', 'challange1.pdf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Fayl Yüklənilir",
      description: "challange1.pdf faylı yüklənir. Brauzerinizin yükləmə qovluğunu yoxlayın.",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate(`/challenge/${id}`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Tapşırığa Qayıt
          </Button>
          <div className="flex items-center space-x-2">
            <Globe className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold">{challenge.title}</h1>
            <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
              {challenge.difficulty}
            </Badge>
          </div>
        </div>
        <div className="text-lg font-bold text-primary">{challenge.points} xal</div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Workspace */}
        <div className="lg:col-span-2 space-y-6">
          {/* Challenge Environment */}
          <Card className="cyber-card-glow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Terminal className="mr-2 h-5 w-5" />
                Tapşırıq Mühiti
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-black rounded-lg p-4 border">
                  <div className="text-green-400 font-mono text-sm mb-2">
                    $ Hədəf URL: {challenge.targetUrl}
                  </div>
                  <div className="text-green-400 font-mono text-sm">
                    $ Status: Mühit Hazırdır
                  </div>
                </div>
                <Button
                  onClick={() => window.open(challenge.targetUrl, '_blank')}
                  className="w-full"
                >
                  <Globe className="mr-2 h-4 w-4" />
                  Tapşırıq Mühitini Aç
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Flag Submission */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Flag className="mr-2 h-5 w-5" />
                Flaqı Təqdim Et
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Flaqı daxil edin (məsələn, CTF{flaq_buraya})"
                    value={flagInput}
                    onChange={(e) => setFlagInput(e.target.value)}
                    className="font-mono"
                    disabled={isSolved}
                  />
                  <Button
                    onClick={handleFlagSubmit}
                    disabled={!flagInput.trim() || isSubmitting || isSolved}
                  >
                    {isSubmitting ? (
                      <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Flaqlar böyük-kiçik hərfə həssasdır və CTF{} bükücü daxil olmalıdır
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Workspace Tabs */}
          <Tabs defaultValue="notes" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="notes">
                <FileText className="mr-2 h-4 w-4" />
                Qeydlər
              </TabsTrigger>
              <TabsTrigger value="console">
                <Terminal className="mr-2 h-4 w-4" />
                Konsol
              </TabsTrigger>
            </TabsList>

            <TabsContent value="notes" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Sizin Qeydləriniz</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Qeydlərinizi, müşahidələrinizi və həll addımlarınızı buraya yazın..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[300px] font-mono"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="console" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Konsol Çıxışı</CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <div
                    ref={terminalRef}
                    className={`bg-black rounded-lg p-4 font-mono text-sm min-h-[300px] max-h-[500px]
                            overflow-y-auto overflow-x-hidden break-words whitespace-pre-wrap ${terminalTextColor}`}
                    onClick={() => inputRef.current && inputRef.current.focus()}
                    style={{ wordBreak: 'break-word' }}
                  >
                    {terminalOutput.map((line, index) => (
                      <div
                        key={index}
                        className={`whitespace-pre-wrap break-words ${
                          line.type === 'error'
                            ? 'text-red-400'
                            : line.type === 'success'
                            ? 'text-green-400'
                            : line.type === 'command'
                            ? 'text-blue-400'
                            : line.type === 'welcome'
                            ? 'text-yellow-400'
                            : line.type === 'info'
                            ? 'text-yellow-400'
                            : terminalTextColor
                        }`}
                      >
                        {line.line}
                      </div>
                    ))}
                    {/* Cari prompt */}
                    <div className="flex items-center mt-2">
                      <span className="text-green-400 font-bold flex-shrink-0">{currentUser}@ctf-box:{currentDir}$ </span>
                      <span className="text-gray-100 ml-1">{terminalInput}</span>
                      <span className="text-gray-500 ml-1 animate-pulse">█</span>
                    </div>
                  </div>
                  {/* Gizli input - ekran xaricinə köçürüldü, layout-a təsir etməsin deyə */}
                  <Input
                    ref={inputRef}
                    type="text"
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    onKeyDown={handleTerminalSubmit}
                    className="absolute -left-[9999px] top-auto opacity-0 pointer-events-none"
                    autoFocus
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Tez Hərəkətlər</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleDownloadFile}
              >
                <CloudDownload className="mr-2 h-4 w-4" />
                Faylları Yüklə
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <RefreshCcw className="mr-2 h-4 w-4" />
                Mühiti Sıfırla
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleGetHint}
                disabled={revealedHints >= (challenge?.hints?.length || 0)}
              >
                <Lightbulb className="mr-2 h-4 w-4" />
                İpucu Al ({revealedHints} / {challenge?.hints?.length || 0})
              </Button>
            </CardContent>
          </Card>

          {/* Hints */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="mr-2 h-5 w-5" />
                İpucular
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {challenge.hints.map((hint, index) => (
                <div key={index} className="p-3 bg-secondary/20 rounded-lg">
                  <div
                    className={`text-sm transition-all duration-500 ${
                      index < revealedHints ? 'blur-none' : 'blur-sm'
                    }`}
                  >
                    <span className="font-medium text-primary">İpucu {index + 1}:</span> {index < revealedHints ? hint : '...'}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Progress */}
          <Card>
            <CardHeader>
              <CardTitle>İrəliləyiş</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-sm">Mühitə daxil olundu</span>
              </div>
              <div className="flex items-center space-x-2">
                {isSolved ? (
                  <CheckCircle className="h-4 w-4 text-green-400" />
                ) : (
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                )}
                <span className={`text-sm ${isSolved ? 'text-green-400' : 'text-muted-foreground'}`}>
                  {isSolved ? 'Flaq tapıldı!' : 'Flaq hələ tapılmayıb'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChallengeWorkspace;