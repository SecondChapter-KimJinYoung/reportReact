import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import DescriptionIcon from '@mui/icons-material/Description';
import PeopleIcon from '@mui/icons-material/People';
import ScheduleIcon from '@mui/icons-material/Schedule';
import InfoIcon from '@mui/icons-material/Info';
import PlaceIcon from '@mui/icons-material/Place';
import PersonIcon from '@mui/icons-material/Person';
import ClassIcon from '@mui/icons-material/Class';

export const ICONS = {
  Refresh: RefreshIcon,
  Delete: DeleteIcon,
  Plus: AddIcon,
  Edit: EditIcon,
  Search: SearchIcon,
  Filter: FilterListIcon,
  ArrowLeft: ArrowBackIcon,
  ArrowRight: ArrowForwardIcon,
  ArrowUp: ArrowUpwardIcon,
  ArrowDown: ArrowDownwardIcon,
  Sort: UnfoldMoreIcon,
  CheckboxOn: CheckBoxIcon,
  CheckboxOff: CheckBoxOutlineBlankIcon,
  StatusSuccess: CheckCircleIcon,
  StatusWarning: WarningIcon,
  StatusError: ErrorIcon,
  MoreVert: MoreVertIcon,
  Visibility: VisibilityIcon,
  CheckCircle: CheckCircleIcon,
  Description: DescriptionIcon,
  People: PeopleIcon,
  Schedule: ScheduleIcon,
  Info: InfoIcon,
  Place: PlaceIcon,
  Person: PersonIcon,
  Class: ClassIcon,
} as const;

export type IconName = keyof typeof ICONS;
